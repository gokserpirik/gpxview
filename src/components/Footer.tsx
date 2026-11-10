import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'

export default function Footer() {
  return (
    <footer className="pit-footer">
      <HStack gap={4} hAlign="between" wrap="wrap" className="pit-container">
        <Text type="supporting">© {new Date().getFullYear()} GPX Fitness Viewer</Text>
        <Text type="supporting">LOCAL FILE · NO UPLOAD TO A SERVER</Text>
      </HStack>
    </footer>
  )
}
