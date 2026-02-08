import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({
    config: configPromise,
    params,
    searchParams,
  })

export default function NotFound({ params, searchParams }: Args) {
  return NotFoundPage({
    config: configPromise,
    importMap,
    params,
    searchParams,
  })
}
