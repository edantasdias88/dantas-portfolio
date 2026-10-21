import heroCamera from '@/assets/projects/iruas/hero-camera-discovery.webp'
import passengerRoute from '@/assets/projects/iruas/passenger-route-discovery.webp'
import propertyArchitecture from '@/assets/projects/iruas/property-architecture.webp'
import residentialStreet from '@/assets/projects/iruas/urban-residential-street.webp'
import discoveryScreen from '@/assets/projects/iruas/screen-discovery.svg'
import cameraScreen from '@/assets/projects/iruas/screen-camera.svg'
import routeScreen from '@/assets/projects/iruas/screen-routes.svg'
import searchScreen from '@/assets/projects/iruas/screen-search.svg'
import interfaceDetail from '@/assets/projects/iruas/app-interface-detail.svg'

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
