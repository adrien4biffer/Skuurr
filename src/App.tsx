import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/Menu'
import ReservationSection from './components/Reservation'

function App() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <ReservationSection />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
