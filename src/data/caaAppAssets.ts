import feed from '@/assets/projects/caa/app/capture-feed.png'
import properties from '@/assets/projects/caa/app/capture-properties.png'
import filters from '@/assets/projects/caa/app/capture-filters.png'
import connection from '@/assets/projects/caa/app/capture-connection.png'
import details from '@/assets/projects/caa/app/capture-details.png'
import services from '@/assets/projects/caa/app/capture-services.png'
import servicesFilters from '@/assets/projects/caa/app/capture-services-filters.png'
import servicesProfile from '@/assets/projects/caa/app/capture-services-profile.png'
import iago from '@/assets/projects/caa/app/capture-iago.png'
import iagoResponse from '@/assets/projects/caa/app/capture-iago-response.png'
import iagoServiceProviders from '@/assets/projects/caa/app/capture-iago-service-providers.png'
import filtering from '@/assets/projects/caa/app/showcase-context.jpg'
import showcaseMain from '@/assets/projects/caa/app/showcase-main.jpg'

export const caaAppAssets = {
  narrativePhoto: { src: showcaseMain, width: 1944, height: 809 },
  filtering,
  screens: {
    feed: { src: feed, width: 375, height: 812 },
    properties: { src: properties, width: 375, height: 812 },
    filters: { src: filters, width: 375, height: 812 },
    details: { src: details, width: 750, height: 1624 },
    connection: { src: connection, width: 375, height: 812 },
    services: { src: services, width: 375, height: 812 },
    servicesFilters: { src: servicesFilters, width: 375, height: 812 },
    servicesProfile: { src: servicesProfile, width: 375, height: 812 },
    iago: { src: iago, width: 375, height: 812 },
    iagoResponse: { src: iagoResponse, width: 375, height: 812 },
    iagoServiceProviders: { src: iagoServiceProviders, width: 375, height: 812 },
  },
} as const
