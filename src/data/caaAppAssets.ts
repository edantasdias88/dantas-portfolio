import appInUse from '@/assets/projects/caa/app/app-in-use.jpg'
import propertyPhoto from '@/assets/projects/caa/app/property-photo.jpg'
import screenDetails from '@/assets/projects/caa/app/screen-details.svg?url'
import screenIago from '@/assets/projects/caa/app/screen-iago.svg?url'
import screenProperties from '@/assets/projects/caa/app/screen-properties.svg?url'
import screenServices from '@/assets/projects/caa/app/screen-services.svg?url'
import showcaseClosingBg from '@/assets/projects/caa/app/showcase-closing-bg.jpg'
import showcaseContext from '@/assets/projects/caa/app/showcase-context.jpg'
import showcaseMain from '@/assets/projects/caa/app/showcase-main.jpg'

export const caaAppAssets = {
  showcaseMain,
  screens: [
    { id: 'properties', src: screenProperties },
    { id: 'details', src: screenDetails },
    { id: 'services', src: screenServices },
    { id: 'iago', src: screenIago },
  ],
  propertyPhoto,
  appInUse,
  showcaseContext,
  showcaseClosingBg,
  closingScreen: screenIago,
} as const
