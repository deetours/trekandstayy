import type { Metadata } from 'next'
import AboutExperience from '@/components/about/AboutExperience'

export const metadata: Metadata = {
  title: 'About | Trek and Stay',
  description: 'Why Trek and Stay runs small, honest adventure routes instead of packaged tourism.',
}

export default function AboutPage() {
  return <AboutExperience />
}
