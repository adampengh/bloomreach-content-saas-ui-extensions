// API
import {
  getComponent,
  putComponent,
} from 'bloomreach-content-management-apis'

export const copyComponent = async (component, channelId, channel, environment, xAuthToken) => {
  console.log('copy component', component, 'to channel', channel.id)
  const componentGroup = component.split('/')[0]
  console.log('componentGroup', componentGroup)
  const componentName = component.split('/')[1]
  console.log('componentName', componentName)

  // Check if component exists in destination channel
  const xResourceVersion = await getComponent(
    environment,
    xAuthToken,
    channel.id,
    componentGroup,
    componentName
  )
    .then(response => {
      console.log('Check for Existing Component', response.headers)
      return response.headers['x-resource-version']
    })
    .catch(error => console.error('Get Component Error', error.message))

  // Get component
  const componentData = await getComponent(
    environment,
    xAuthToken,
    channelId,
    componentGroup,
    componentName
  )
    .then(response => {
      console.log('Get Component Success', response.headers)
      return response.data
    })
    .catch(error => console.error('Get Component Error', error.message))
  console.log('componentData', componentData)
  console.log('xResourceVersion', xResourceVersion)

  // Put component
  if (componentData) {
    await putComponent(
      environment,
      xAuthToken,
      channel.id,
      componentGroup,
      componentName,
      componentData,
      xResourceVersion
    )
      .then(response => {
        console.log('Put Component Success')
      })
      .catch(error => console.error('Put Component Error', error))
  }
}
