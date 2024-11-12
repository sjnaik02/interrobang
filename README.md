# Interrobang

Interrobang is a tool for creating audience polls for Tangle.

## THINGS TO NOTE

- This is not optimised for mobile. The public facing surveys themselves are responsive, but any dashboard pages are not. Use desktop for survey creation/management.
- Things are slow and clunky. Perf improvements down the line.
- Surveys do not auto-save. You have to save them manually.
- There are no tests.
- There's only 16 colours in the chart customisation palette.
- Need a kanban board for feature tracking.
- Db and serverless calls can be optimised when fetching data
- DB schema currently uses a jsonb column for questions and responses. This may need refactoring in the future.

## TODOS

### Stage 1: Survey Builder

- [x] Scaffold out the project
- [x] Connect to database
- [x] Connect to Clerk
- [x] Set up auth + protected dashboard route
- [x] Set up database schemas
- [x] Create a survey with 1 question
- [x] Save survey as draft functionality
- [x] Publish survey functionality
- [x] Add more question types
- [x] Edit published survey functionality
- [x] Archive survey functionality
- [x] Basic responses page works
- [x] Basic visualisation for responses
- [x] Export visualisation as image
- [x] Table for Text Responses
- [ ] Polished design for survey/visualise page
- [ ] Detailed visualisation customisation
- [ ] Refactor visualisations to use Shadcn's Recharts Utils
- [ ] Better design for responses page
- [ ] More details in dashboard
- [ ] Searchable surveys
- [ ] Sortable surveys
- [ ] Filterable surveys
- [ ] Visualise page
- [ ] More question types - Checkbox, Ranking
- [ ] More visualisation types - Pie chart, Horizontal bar chart
