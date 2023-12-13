import layoutStyles from './layout.module.css';
import Navbar from '../pages/navbar';

export default function Layout({ children }) {
    /* return <div className={layoutStyles.container}>{children}</div>; */
    
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}