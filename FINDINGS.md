## Findings

### Frontend

- In all the previous components, the use of useEffect was prone to causing memory leaks if the component unmounted before the async operation completed. This has been addressed by switching to a custom useFetch hook that handles cleanup properly.
- The SearchBar component had issues with the search results dropdown not closing when clicking outside of it. This has been fixed by adding an onBlur handler to the container div that checks if the focus has moved outside the component before hiding the results.
- The styling of the search results was inconsistent, with missing colors and positioning. CSS has been updated to ensure the results are properly styled and positioned relative to the search bar.

### Backend

- No changes made to the core logic.
- The API endpoints were missing proper error handling for certain edge cases. This has been improved by adding more comprehensive try-catch blocks and returning appropriate HTTP status codes.
- The API endpoints were missing return type annotations. These have been added for better type safety and clarity, and documentation improvement.

### What I'd do next

- Implement unit tests for the new useFetch hook to ensure it handles various scenarios correctly.
- Add integration tests for the SearchBar component to verify that the dropdown behaves as expected in different
- Implement the tagging filtering feature on the frontend by creating a fiterable selection UI for tags.
- Enhance the backend to support filtering documents by tags, including updating the database schema and API endpoints.
  - Implement a new field to the database schema to store tags as a string, with values separated by commas.
  - Update the document creation and update endpoints to accept tags.
- Include, in the DocumentDetail component, an input to add or remove tags from a document.
- Conduct a performance review of the API endpoints to identify any potential bottlenecks and optimize scenarios.
  - Consider adding indexing to the tags field in the database for faster querying.
- Optimize the search functionality to handle larger datasets more efficiently, possibly by implementing pagination or lazy loading of results.
