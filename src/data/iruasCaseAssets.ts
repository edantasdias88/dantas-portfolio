import heroCamera from '@/assets/projects/iruas/hero-camera-discovery.webp'
import passengerRoute from '@/assets/projects/iruas/passenger-route-discovery.webp'
import propertyArchitecture from '@/assets/projects/iruas/property-architecture.webp'
import residentialStreet from '@/assets/projects/iruas/urban-residential-street.webp'
import discoveryScreen from '@/assets/projects/iruas/screen-discovery.svg?url'
import cameraScreen from '@/assets/projects/iruas/screen-camera.svg?url'
import routeScreen from '@/assets/projects/iruas/screen-routes.svg?url'
import searchScreen from '@/assets/projects/iruas/screen-search.svg?url'
import interfaceDetail from '@/assets/projects/iruas/app-interface-detail.svg?url'

export const iruasCaseAssets = {
  heroCamera,
  passengerRoute,
  propertyArchitecture,
  residentialStreet,
  interfaceDetail,
  screens: [
    { id: 'gestures', src: discoveryScreen },
    { id: 'camera', src: cameraScreen },
    { id: 'routes', src: routeScreen },
    { id: 'text', src: searchScreen },
  ] as const,
}
