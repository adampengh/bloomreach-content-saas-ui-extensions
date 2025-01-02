// API
import {
  createDeveloperProject,
  addChannelToProject,
  getDeveloperProject,
} from 'bloomreach-content-management-apis'

// Lib
import {
  copyDocument,
  copyPage,
  copyResourceBundle
} from 'src/lib/operations'

// Utils
import { pollingPromise } from 'src/lib/utils'


export const copyEntireProject = async (
  appConfiguration,
  projectData,
  projectId,
) => {
  console.group('COPY ENTIRE PROJECT')
  console.log('projectData:', projectData)
  console.log('appConfiguration:', appConfiguration)
  const sourceProjectId = projectData.id
  let targetProjectId = projectId

  const {
    environment: targetEnvironment,
    xAuthToken: targetXAuthToken,
  } = appConfiguration.environments.target

  // Check if the source project contains Content Type changes
    // If it does, check if the target environment has an existing project with content type changes


  // Create a Developer Project in the target environment
  if (targetProjectId === 'new') {
    targetProjectId = await createDeveloperProject(
      targetEnvironment,
      targetXAuthToken,
      projectData.name,
      projectData.includeContentTypes,
    )
      .then((response) => {
        console.log('response', response.data)
        console.log('Project created successfully')
        return response.data.id
      })
      .catch(() => {
        console.error('Error creating project:')
      })
  }

  console.log('targetProjectId:', targetProjectId)


  // Add any channels to the target
  const channels = projectData?.items?.channels;
  for await (const channel of channels) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const channelName = channel.id.replace(`-${sourceProjectId}`, '')

    // Check if the channel already exists in the target project
    const channelExists = await getDeveloperProject(targetEnvironment, targetXAuthToken, targetProjectId, true)
      .then(response => {
        return response.data.items?.channels?.find(ch => ch.id.includes(channelName)) !== undefined ? true : false
      })
      .catch(error => console.error('Error Getting Project:', error))
    console.log('channelExists:', channelExists)

    if (!channelExists) {
      console.log('Adding channel to target project:', channelName)
      await addChannel(targetEnvironment, targetXAuthToken, targetProjectId, channelName)
        .then(() => console.log('Channel Added:', channelName))
        .catch(error => console.error('Error Adding Channel to Project', error))
    }
  }



  // Copy Resource Bundles from the source project to the target project
  const resourceBundles = projectData?.items?.resourceBundles;
  for await (const resourceBundle of resourceBundles) {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Copying resource bundle:', resourceBundle)
    await copyResourceBundle(appConfiguration, sourceProjectId, targetProjectId, resourceBundle.path)
  }


  // Copy Content Types from the source project to the target project


  // Copy Channel Configuration from the source project to the target project


  // Copy Documents from the source project to the target project
  const documents = projectData?.items?.documents;
  for await (const document of documents) {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Copying document:', document)
    await copyDocument(appConfiguration, sourceProjectId, targetProjectId, document.path)
  }


  // Copy Pages from the source project to the target project
  const pages = projectData?.items?.pages;
  for await (const page of pages) {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Copying page:', page)
    await copyPage(appConfiguration, sourceProjectId, targetProjectId, page.path)
  }

  console.groupEnd()
}


const addChannel = async (environment, xAuthToken, projectId, channelName) => {
  console.group('Adding Channel', channelName)

  await addChannelToProject(environment, xAuthToken, projectId, channelName)
    .then(response => console.log('Channel Added:', response.data))
    .catch(error => console.error('Error Adding Channel to Project', error))

  // Get the status of the project
  // Poll until the project status is 'IN_PROGRESS'
  const getProjectStatus = async () => {
    console.log(new Date(), 'Calling Project API');
    return await getDeveloperProject(environment, xAuthToken, projectId)
      .then(response => response.data?.state?.status)
      .catch(err => console.error(err))
  };

  // Test the project status, it should be 'IN_PROGRESS' before we can try to add another channel
  let count = 0;
  const testProjectStatus = (status) => {
    const MAX_RETRIES = 10;
    count++
    console.log(new Date(), 'Testing', status, status === 'IN_PROGRESS' ? 'OK' : 'Not yet...');
    return count === MAX_RETRIES || status === 'IN_PROGRESS';
  };


  // Poll the project status until it is 'IN_PROGRESS' or until we reach the max retries
  console.log(new Date(), 'Starting Polling Project');
  const { promise, stopPolling } = pollingPromise(getProjectStatus, testProjectStatus, 1000);
  await promise.then(() => {
    console.log(new Date(), 'Channel has been added to project')
  })
  console.log(new Date(), 'Canceling Polling Project');
  stopPolling();

  console.groupEnd()
}








