const axios = require('axios');
require('dotenv').config();
const circleciToken = process.env.CIRCLECI_TOKEN;
if(!circleciToken) {
    console.error('CIRCLECI_TOKEN is required');
    process.exit(1);
}
const ghBranch = process.env.GH_BRANCH || "main";
const ghOwner = process.env.GH_OWNER;
const repositories = process.env.REPOSITORIES.split(',');

async function getLastSuccessfulWorkflowRun(owner, repo) {
  
  const pipelineUrl = `https://circleci.com/api/v2/project/gh/${owner}/${repo}/pipeline?branch=${ghBranch}`;

  try {
    const pipelineResponse = await axios.get(pipelineUrl, {
      headers: {
        'Circle-Token': circleciToken,
      },
    });

    const pipelines = pipelineResponse.data.items;
    if (pipelines.length === 0) {
      return null;
    }

    for (const pipeline of pipelines) {
      const pipelineId = pipeline.id;
      const workflowUrl = `https://circleci.com/api/v2/pipeline/${pipelineId}/workflow`;

      const workflowResponse = await axios.get(workflowUrl, {
        headers: {
          'Circle-Token': circleciToken,
        },
      });

      const workflows = workflowResponse.data.items;
      for (const workflow of workflows) {
        if (workflow.status === 'success') {
          return {
            project: `${owner}/${repo}`,
            lastRun: workflow.stopped_at,
            pipelineInfo: pipeline,
          };
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching data for ${owner}/${repo}: ${error.message}`);
  }

  return null;
}

function calculateTimeDifferenceInDays(date1, date2) {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs(date1 - date2) / oneDayInMilliseconds);
}

(async () => {
  const results = [];

  for (const repo of repositories) {    
    const result = await getLastSuccessfulWorkflowRun(ghOwner, repo);

    if (result) {
      const { project, lastRun, pipelineInfo } = result;

      const today = new Date();
      const lastRunDate = new Date(lastRun);
      const daysDifference = calculateTimeDifferenceInDays(today, lastRunDate);

      let status = '';
      if (daysDifference >= 5 && daysDifference < 7) {
        status = 'WARNING PERIOD';
      } else if (daysDifference >= 7) {
        status = 'CONSIDER DEPLOY';
      } else{
        status = 'TOLERABLE';
      }

      results.push({
        project,
        lastRun,
        pipelineInfo,
        status,
      });
    } else {
      results.push({
        project: `${owner}/${repo}`,
        status: 'No successful workflow runs found',
      });
    }
  }

  for (const result of results) {
    const { pipelineInfo } = result;
    const commitSubject = pipelineInfo.vcs.commit.subject;
    const pipelineUrl = `${pipelineInfo.vcs.origin_repository_url}/commit/${pipelineInfo.vcs.revision}`;

    console.log(`Project: ${result.project}`);
    console.log(`Last Run: ${result.lastRun}`);
    console.log(`Commit Subject: ${commitSubject}`);
    console.log(`Status: ${result.status}`);
    console.log(`GitHub Link: ${pipelineUrl}`);
    console.log('----------------------------------');
  }

})();
