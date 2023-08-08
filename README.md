# check-circleci-last-build-success

# CircleCI Last Successful Workflow Checker

  

This script allows you to check the last successful workflow run for multiple repositories on CircleCI. It fetches pipeline and workflow data using the CircleCI API and provides information about the last successful run, including the commit subject and a link to view the pipeline on GitHub.

  

## Getting Started

  

1. Clone this repository to your local machine.

  

2. Install the required dependencies by running the following command:

  

```bash
npm install
```

Create a  .env  file  in  the  root  of  the  project  with  the  following  variables:

```
CIRCLECI_TOKEN=<Your CircleCI API  Token>
GH_OWNER=<GitHub organization or  username>
REPOSITORIES=<Comma-separated list of  repository  names>
```
Make sure  to  replace <Your  CircleCI  API  Token> with  your  actual  CircleCI  API  token.  You  can  find  or  create  your  CircleCI  API  token  from  the  CircleCI  website.

Replace <GitHub  organization  or  username> with  your  GitHub  organization  or  username.

Replace <Comma-separated  list  of  repository  names> with  the  names  of  the  repositories  you  want  to  check,  separated  by  commas.  For  example:

Run the  script  using  the  following  command:

```bash
node script.js
```

The script  will  fetch  the  last  successful  workflow  run  for  each  repository  and  provide  information  about  it.  It  will  also  check  the  time  difference  and  add  a  status  message  based  on  the  duration  since  the  last  successful  run.

  

### Example Output

The script  will  display  output  in  the  console  with  the  following  information  for  each  repository:

Project: The  owner  and  repository  name  on  GitHub.

Last Run:  The  timestamp  of  the  last  successful  workflow  run.

Commit Subject:  The  subject  of  the  last  commit  associated  with  the  workflow.

Status: The  status  message  based  on  the  time  difference  since  the  last  successful  run.

GitHub Link:  A  link  to  the  commit  on  GitHub.

```
Project: jonymusky/project-a
Last Run:  2023-08-01T12:34:56Z
Commit Subject:  Update  dependencies
Status: CONSIDER  DEPLOY
GitHub Link:  https://github.com/jonymusky/project-a/commit/abcdef0123456789

----------------------------------

Project: jonymusky/project-b
Last Run:  2023-08-02T10:20:30Z
Commit Subject:  Fix  bug  in  invoice  
Status: WARNING  PERIOD
GitHub Link:  https://github.com/jonymusky/project-b/commit/0123456789abcdef

----------------------------------
```


Please note  that  the  actual  output  will  depend  on  the  repositories  you  specified  in  the  .env  file.
