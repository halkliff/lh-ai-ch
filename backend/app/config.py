import os


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5432/docproc"
    )
    SECRET_KEY: str = "my-super-secret-key-do-not-share"
    UPLOAD_DIR: str = "/tmp/docproc_uploads"


settings = Settings()
