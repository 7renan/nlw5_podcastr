import { GetStaticProps } from 'next'
import { type } from 'os'
import Image from 'next/image'
import { api } from '../services/api'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import { convertDurationTimeString } from '../utils/convertDurationToTimeString'

// styles
import styles from './home.module.scss'

type Episode = {
  id: string,
  title: string, 
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationsAsString: string,
  description: string,
  url: string
}

type HomeProps = {
  allEpisodes: Episode[]
  latestEpisodes: Episode[]
}

export default function Home({allEpisodes, latestEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}>

      <section className={styles.latestEpisodes}>
        <h2>Últimos episódios</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                 width={192}
                 height={192}
                 src={episode.thumbnail} 
                 alt="Membros"
                 objectFit="cover" 
                 />

                 <div className={styles.episodeDetail}>
                    <a href="#">{episode.title}</a>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationsAsString}</span>
                 </div>

                 <button>
                   <img src="./play-green.svg" alt="Tocar espisódio" />
                 </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{width: 100}}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail} 
                    alt="Membros"
                    objectFit="cover" 
                  />
                  </td>
                  <td>
                    <a href="#">{episode.title}</a>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationsAsString}</td>
                  <td>
                    <button>
                      <img src="./play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: episode.file.duration,
      durationsAsString: convertDurationTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      allEpisodes: allEpisodes,
      latestEpisodes: latestEpisodes,
    },
    revalidate: 60 * 60 * 8
  }

}