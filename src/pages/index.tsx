import { GetStaticProps } from 'next'
import { type } from 'os'
import { api } from '../services/api'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'

type Episode = {
  id: String,
  title: String,
  members: String
}

type HomeProps = {
  episodes: Episode[]
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <div>
        {JSON.stringify(props.episodes)}
      </div>
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

  const episodes = data.Map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: episode.file.duration,
      
    }
  })

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8
  }

}