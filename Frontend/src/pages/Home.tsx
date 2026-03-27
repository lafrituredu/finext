import Navbar from "../components/layout/Navbar"

function Home() {
  return (
    <>
        <div className="fixed w-full bg-blue-500 text-white p-4"><Navbar/></div>
        <p className="h-1000">Home component!</p>
    </>
  )
}

export default Home