import { NFTStorage, File } from 'nft.storage'
import { pack } from 'ipfs-car/pack';

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhMTI2NTUyYUQyNTAwZWQxNzYzNWRFNTZiOUY0QkQ2QzE2MzY3ZjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MjExNjc3NTE5NywibmFtZSI6ImR1ZGUifQ.KrSkV0hh8XPJ1tRYMMg9Xdx1SFAc1XoteDow_qxllSs'
const client = new NFTStorage({ token: apiKey })

const metadata = await client.store({
  name: 'Pinpie',
  description: 'Pin is not delicious beef!',
  image: new File([/* data */], 'pinpie.jpg', { type: 'image/jpg' })
})
console.log(metadata.url)