// project import

import SimpleBar from '../../../../components/third-party/SimpleBar';
import Navigation from './Naviagtion';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent({toggleDrawerFunc}) {
  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column',} }}>
        <Navigation toggleDrawerFunc={toggleDrawerFunc}/>
      </SimpleBar>
    </>
  );
}