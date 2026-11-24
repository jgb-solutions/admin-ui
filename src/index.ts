/**
 * @jgb-solutions/admin: the admin panel kit for JGB Solutions apps. Import the stylesheet once
 * (`import '@jgb-solutions/admin/styles.css'`), wrap the admin in <AdminShell>, and build pages from
 * the blocks. Components take data and callbacks; the app fetches, checks permissions on the server
 * and decides what happens.
 */
export { AdminShell, type AdminShellProps } from './shell/AdminShell'
export { Sidebar, type SidebarProps, type AppIdentity } from './shell/Sidebar'
export { Dock, type DockProps } from './shell/Dock'
export { PageHeader, TopSearch, type PageHeaderProps, type TopSearchProps } from './shell/PageHeader'
export { ThemeToggle } from './shell/ThemeToggle'
export { plainLink, type NavItem, type NavSection, type LinkProps, type RenderLink } from './shell/nav'
export { useAdminTheme, type Theme, type ThemeChoice } from './theme'
export { Button, IconButton, type ButtonProps, type IconButtonProps } from './ui/Button'
export { Avatar, initials, type AvatarProps } from './ui/Avatar'
export { icons, type IconName } from './icons'
export { contrastRatio, inkOn } from './contrast'
