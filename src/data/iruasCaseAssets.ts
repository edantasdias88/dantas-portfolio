import heroCamera from '@/assets/projects/iruas/hero-camera-discovery.webp'
import passengerRoute from '@/assets/projects/iruas/passenger-route-discovery.webp'
import propertyArchitecture from '@/assets/projects/iruas/property-architecture.webp'
import residentialStreet from '@/assets/projects/iruas/urban-residential-street.webp'
import discoveryScreen from '@/assets/projects/iruas/capture-discovery.png'
import cameraScreen from '@/assets/projects/iruas/capture-camera.svg?url'
import routeScreen from '@/assets/projects/iruas/capture-routes.png'
import searchScreen from '@/assets/projects/iruas/capture-search.svg?url'
import interfaceDetail from '@/assets/projects/iruas/capture-detail.png'

export const iruasCaseAssets = {
  heroCamera,
  passengerRoute,
  propertyArchitecture,
  residentialStreet,
  interfaceDetail: { src: interfaceDetail, width: 750, height: 1624 },
  screens: [
    { id: 'gestures', src: discoveryScreen, width: 375, height: 812 },
    { id: 'camera', src: cameraScreen, width: 270, height: 608 },
    { id: 'routes', src: routeScreen, width: 750, height: 1624 },
    { id: 'text', src: searchScreen, width: 270, height: 608 },
  ] as const,
}
