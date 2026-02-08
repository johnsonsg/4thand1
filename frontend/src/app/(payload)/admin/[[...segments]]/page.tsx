import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '@payload-config'
import { importMap } from '../importMap'

type PageProps = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ params, searchParams }: PageProps) {
  const normalizedParams = params.then((value) => ({
    segments: value.segments ?? [],
  }))

  const normalizedSearchParams = searchParams.then((value) => {
    const entries = Object.entries(value).filter(([, entry]) => entry !== undefined)
    return Object.fromEntries(entries) as Record<string, string | string[]>
  })

  return RootPage({
    config: configPromise,
    importMap,
    params: normalizedParams,
    searchParams: normalizedSearchParams,
  })
}

export const generateMetadata = (props: PageProps): Promise<Metadata> => {
  const normalizedParams = props.params.then((value) => ({
    segments: value.segments ?? [],
  }))

  const normalizedSearchParams = props.searchParams.then((value) => {
    const entries = Object.entries(value).filter(([, entry]) => entry !== undefined)
    return Object.fromEntries(entries) as Record<string, string | string[]>
  })

  return generatePageMetadata({
    config: configPromise,
    params: normalizedParams,
    searchParams: normalizedSearchParams,
  })
}
