import { NavLink } from 'react-router-dom'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'

export default function Header() {
  return (
    <HStack as="header" className="pit-site-header">
      <HStack as="nav" gap={4} hAlign="between" vAlign="center" className="pit-nav" aria-label="Main navigation">
        <NavLink to="/" className="pit-brand" aria-label="GPX Fitness Viewer home">
          <i aria-hidden="true" className="pit-brand-mark" />
          <Text type="label">GPX <strong>FITNESS</strong></Text>
        </NavLink>
        <HStack gap={5} vAlign="center">
          <NavLink to="/" end className={({ isActive }) => `pit-nav-link ${isActive ? 'pit-nav-active' : ''}`}>Viewer</NavLink>
          <NavLink to="/how-to" className={({ isActive }) => `pit-nav-link ${isActive ? 'pit-nav-active' : ''}`}>Export guide</NavLink>
        </HStack>
      </HStack>
    </HStack>
  )
}
