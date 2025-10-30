
import Header from './header';
export default function SiteHeader() {
  return (
    <header className='sticky top-0 bg-background/30 backdrop-blur-3xl z-50 w-full  shadow-md h-24 flex justify-center'>
         <div  className='container   h-full w-full  flex justify-center items-center '>
         <Header  />
         </div>
    </header>
  );
}
