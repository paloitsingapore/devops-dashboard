import RotatingDashboard from '../components/rotating-dashboard'
import Frontend from './frontend'
import DGE from './dge'

export default () =>
  <RotatingDashboard interval='10'>
    <Frontend />
    <DGE />
  </RotatingDashboard>
