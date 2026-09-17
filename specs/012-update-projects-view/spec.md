# Feature Specification: Projects Grid Pagination and Filtering

**Feature Branch**: `012-update-projects-view`

**Created**: 2026-09-17

**Status**: Draft

**Input**: User description: "Update Projects Overview: The Projects page of the application need a change of business logic: the number of projects per page MUST change to 3x3 (3 row, 3 colums) with a total of 9 projects per page. And we need to create a filter where the fetch service to github ONLY get projects with a codebase; empty projects (this include projects that only have a readme.md or licence or other kind of file without codebase). Also, the Project page view need a search input that filter the list by name, a fiel to filter by stars and a dynamic filter by progra,mming language hydrated by the languages of the projects ables. What To Do: * A filter over the fetch to get all repositories from github filtering out empty repositories, respositories that does not have codebase or any code. * Pagination with 3x3 element per page. * Over the list, there must be a search input field to search by name, a filter by stars, a select filter by language programming populated dynamically by projects language programming."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Codebase Projects in a 3x3 Grid (Priority: P1)

As a user browsing GitHub projects, I want to see only repositories containing actual code organized in a 9-item (3x3 grid) layout per page, so that I can efficiently focus on real codebases without clutter from empty or documentation-only repositories.

**Why this priority**: Displaying valid codebase projects in a clean, consistent 3x3 grid forms the core baseline experience of the updated Projects view.

**Independent Test**: Fetch repositories from GitHub and verify that all presented projects contain actual codebases (excluding documentation-only/empty repos) and display in maximum 9 items per page (3 columns by 3 rows).

**Acceptance Scenarios**:

1. **Given** a set of GitHub repositories containing both codebases and empty/documentation-only repositories, **When** the user accesses the Projects view, **Then** only repositories containing source code are loaded and displayed.
2. **Given** a list of valid codebase projects, **When** the page renders, **Then** projects are displayed in a 3x3 grid containing up to 9 items per page with navigation controls for pagination.
3. **Given** the user is on page 1 of projects, **When** the user clicks the "Next" page control, **Then** the next batch of up to 9 projects is rendered in the 3x3 grid.

---

### User Story 2 - Search and Dynamic Filtering (Priority: P2)

As a user searching for specific projects, I want to filter the project list by name, minimum stars, and primary programming language, so that I can quickly discover relevant repositories.

**Why this priority**: Enhances discoverability and enables targeted exploration across large project lists.

**Independent Test**: Apply name search, minimum star count, and programming language select filters independently and in combination, verifying that the displayed grid updates in real time to match criteria.

**Acceptance Scenarios**:

1. **Given** a list of loaded codebase projects, **When** the user types text into the project name search input, **Then** the grid instantly filters to display only projects whose names match the search query.
2. **Given** a list of loaded codebase projects, **When** the user selects a minimum star count filter value, **Then** the grid displays only projects meeting or exceeding that star count.
3. **Given** a list of loaded codebase projects, **When** the user opens the programming language dropdown, **Then** the options dynamically match all distinct programming languages present across the fetched projects.
4. **Given** active search or filter criteria, **When** the user selects a specific programming language from the dropdown, **Then** the grid updates to show only projects created in that language.

---

### User Story 3 - Pagination Reset on Filter Application (Priority: P3)

As a user applying filters to a paginated project list, I want the pagination to reset to the first page whenever filter criteria change, so that I never get stuck on an out-of-bounds empty page.

**Why this priority**: Prevents user interface confusion and navigation bugs when filter results shrink total pages.

**Independent Test**: Navigate to page 2 or 3, enter a search term or change a filter, and confirm the view resets to page 1 showing the matching results.

**Acceptance Scenarios**:

1. **Given** the user is viewing page 2 of project results, **When** any filter (name, stars, or language) is modified, **Then** the active page number automatically resets to page 1.
2. **Given** a search or filter result with fewer than 9 projects, **When** displayed, **Then** pagination controls reflect the reduced total page count accurately.

---

### Edge Cases

- **No Codebase Repositories Available**: If all fetched repositories are empty or documentation-only, display a friendly empty state message indicating no codebase projects were found.
- **No Filter Matches**: If user search or filter criteria return 0 matching projects, display a clear "No projects match your search criteria" message with an option to clear filters.
- **Repository Without Primary Language**: If a valid codebase project has no primary language specified or detected, it is grouped under an "Other" or "Unspecified" language category in the dynamic language filter.
- **Single Page Results**: If total matching projects are 9 or fewer, pagination controls should gracefully disable or hide page navigation buttons while showing current page info.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST filter fetched GitHub repositories to exclude empty repositories and repositories without source code (e.g., repositories containing only README, license, or non-code files).
- **FR-002**: System MUST display project items in a grid layout consisting of 3 columns and 3 rows, accommodating exactly 9 project cards per page.
- **FR-003**: System MUST provide pagination controls enabling users to navigate back and forth between pages of 9 projects each.
- **FR-004**: System MUST provide a text search input field that filters the project list by matching the search string against project names in real time.
- **FR-005**: System MUST provide a star count filter allowing users to filter projects by minimum number of stars.
- **FR-006**: System MUST dynamically populate a programming language select dropdown using the set of unique programming languages extracted from all fetched codebase projects.
- **FR-007**: System MUST allow simultaneous filtering across project name search, star count, and programming language.
- **FR-008**: System MUST reset current page index to page 1 whenever search or filter criteria are updated.

### Key Entities *(include if feature involves data)*

- **Project**: Represents a GitHub repository containing a codebase, including attributes such as name, description, primary programming language, star count, repository URL, and codebase validity flag.
- **Project Filter Criteria**: State entity tracking current search text (name), minimum star threshold, selected programming language, and active page index.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of projects displayed on the Projects page contain a non-empty codebase (0 documentation-only or empty repositories shown).
- **SC-002**: Projects page consistently renders exactly 9 project cards per page (3x3 grid) when 9 or more matching projects exist.
- **SC-003**: Dynamic programming language dropdown populated automatically with 100% of available languages present in the fetched projects list.
- **SC-004**: Filter and search operations reflect in the UI grid in under 100 milliseconds.

## Assumptions

- Codebase filtering is defined as repositories possessing non-zero size and an identified primary programming language or detected code files.
- The 3x3 grid layout (9 items per page) is fixed for desktop/standard viewport views and adapts responsively for smaller screens if required.
- Star filter allows filtering by a numeric minimum star count.
- Language filter options update dynamically whenever the underlying fetched project dataset changes.
