// compinnets
import Header from '../components/Header'
import Player from '../components/Player'

// styles
import styles from '../styles/wrapper.module.scss'
import '../styles/global.scss'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
      <Header/>
      <Component {...pageProps} />
      </main>
      <Player/>
    </div>
  )
}

export default MyApp

