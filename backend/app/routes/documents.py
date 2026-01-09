import os
from datetime import datetime
from typing_extensions import TypedDict

from fastapi import APIRouter, Depends, UploadFile, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Document, ProcessingStatus
from app.schemas import DocumentResponse, DocumentDetail, UploadFileResponse
from app.services.pdf_processor import extract_text_from_pdf
from app.config import settings

router = APIRouter()


@router.post("/documents")
async def upload_document(
    file: UploadFile, db: AsyncSession = Depends(get_db)
) -> UploadFileResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    file_size = len(content)
    text_content, page_count = await extract_text_from_pdf(file_path)

    document = Document(
        filename=file.filename,
        content=text_content,
        file_size=file_size,
        page_count=page_count,
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)

    processing_status = ProcessingStatus(
        document_id=document.id,
        status="completed",
        processed_at=datetime.utcnow(),
    )
    db.add(processing_status)
    await db.commit()

    return UploadFileResponse(id=document.id, filename=document.filename)


@router.get("/documents")
async def list_documents(db: AsyncSession = Depends(get_db)) -> list[DocumentResponse]:
    result = await db.execute(select(Document))
    documents = result.scalars().all()

    response = []
    for doc in documents:
        status_result = await db.execute(
            select(ProcessingStatus).where(ProcessingStatus.document_id == doc.id)
        )
        status = status_result.scalar_one_or_none()
        response.append(
            DocumentResponse(
                id=doc.id,
                filename=doc.filename,
                file_size=doc.file_size,
                page_count=doc.page_count,
                status=status.status if status else "unknown",
                created_at=doc.created_at,
            )
        )

    return response


@router.get("/documents/{document_id}")
async def get_document(
    document_id: int, db: AsyncSession = Depends(get_db)
) -> DocumentDetail:
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    status_result = await db.execute(
        select(ProcessingStatus).where(ProcessingStatus.document_id == document.id)
    )
    status = status_result.scalar_one_or_none()

    return DocumentDetail(
        id=document.id,
        filename=document.filename,
        content=document.content,
        file_size=document.file_size,
        page_count=document.page_count,
        status=status.status if status else "unknown",
        created_at=document.created_at,
    )


DeleteResponse = TypedDict("DeleteResponse", {"message": str})


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: int, db: AsyncSession = Depends(get_db)
) -> DeleteResponse:
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    status_result = await db.execute(
        select(ProcessingStatus).where(ProcessingStatus.document_id == document.id)
    )
    status = status_result.scalar_one_or_none()
    if status:
        await db.delete(status)

    await db.delete(document)
    await db.commit()

    return {"message": "Document deleted"}
