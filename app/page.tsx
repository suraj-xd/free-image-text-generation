'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Loader2, RefreshCw } from "lucide-react"
import { Textarea } from '@/components/ui/Textarea'
import Image from 'next/image'
import { Switch } from "@/components/ui/Switch"
import toast from 'react-hot-toast'

export default function PollinationsCheatsheet() {
  const [imageResult, setImageResult] = useState<string | null>(null)
  const [textResult, setTextResult] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [imageWidth, setImageWidth] = useState<number>(1024)
  const [imageHeight, setImageHeight] = useState<number>(1024)
  const [imageSeed, setImageSeed] = useState<number>(Math.floor(Math.random() * 1000000))
  const [imageStatus, setImageStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [useRandomSeed, setUseRandomSeed] = useState<boolean>(false)

  useEffect(() => {
    if (useRandomSeed) {
      setImageSeed(Math.floor(Math.random() * 1000000))
    }
  }, [useRandomSeed])

  const handleImageGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImageResult(null)
    setLoading(true)
    setImageStatus('pending')
    const formData = new FormData(e.currentTarget)
    const prompt = formData.get('imagePrompt') as string
    const model = formData.get('imageModel') as string
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${imageWidth}&height=${imageHeight}&seed=${imageSeed}&model=${model}&nologo=true`
    
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('Failed to generate image')
      }
      setImageResult(imageUrl)
      setImageStatus('success')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error("Error generating image. Please try again.")
      setImageStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleTextGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const prompt = formData.get('textPrompt') as string
    const model = formData.get('textModel') as string
    try {
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=${model}`)
      const result = await response.text()
      setTextResult(result)
    } catch (error) {
    toast.error("Error generating text. Please try again.")
      console.error('Error generating text:', error)
      setTextResult('Error generating text. Please try again.')
    }
    setLoading(false)
  }

  const regenerateWithRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000)
    setImageSeed(newSeed)
    handleImageGeneration({ preventDefault: () => {}, currentTarget: document.querySelector('form') } as React.FormEvent<HTMLFormElement>)
  }

  const imageModels = [
    { value: 'flux', label: 'Flux', censored: false, paid: false },
    { value: 'flux-realism', label: 'Flux Realism', censored: true, paid: false },
    { value: 'flux-cablyai', label: 'Flux CablyAI', censored: true, paid: true },
    { value: 'flux-anime', label: 'Flux Anime', censored: true, paid: false },
    { value: 'flux-3d', label: 'Flux 3D', censored: true, paid: false },
    { value: 'any-dark', label: 'Any Dark', censored: true, paid: false },
    { value: 'flux-pro', label: 'Flux Pro', censored: true, paid: true },
    { value: 'turbo', label: 'Turbo', censored: false, paid: false },
  ]

  const textModels = [
    { value: 'openai', label: 'OpenAI GPT-4', censored: true, paid: false },
    { value: 'mistral', label: 'Mistral Nemo', censored: false, paid: false },
    { value: 'mistral-large', label: 'Mistral Large (v2)', censored: false, paid: false },
    { value: 'llama', label: 'Llama 3.1', censored: true, paid: false },
    { value: 'command-r', label: 'Command-R', censored: false, paid: false },
    { value: 'unity', label: 'Unity with Mistral Large', censored: false, paid: false },
    { value: 'midijourney', label: 'Midijourney', censored: true, paid: false },
    { value: 'rtist', label: 'Rtist', censored: true, paid: false },
    { value: 'searchgpt', label: 'SearchGPT', censored: true, paid: false },
    { value: 'evil', label: 'Evil Mode', censored: false, paid: false },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">AI Image / Text Generator</h1>
      
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger className='data-[state=active]:bg-white data-[state=active]:text-black' value="image">Image Generation</TabsTrigger>
          <TabsTrigger className='data-[state=active]:bg-white data-[state=active]:text-black' value="text">Text Generation</TabsTrigger>
        </TabsList>
        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Generate Image</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImageGeneration} className="space-y-4">
                <Input name="imagePrompt" placeholder="Enter your prompt" required />
                <Select name="imageModel">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {imageModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                        <Badge variant={model.censored ? "default" : "destructive"} className="ml-2">
                          {model.censored ? "Censored" : "Uncensored (NSFW)"}
                        </Badge>
                        {model.paid && (
                          <Badge variant="secondary" className="ml-2">
                            PAID
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex space-x-4">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="width-slider">Width: {imageWidth}</label>
                    <input
                      id="width-slider"
                      type="range"
                      min="64"
                      max="2048"
                      value={imageWidth}
                      onChange={(e) => setImageWidth(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="height-slider">Height: {imageHeight}</label>
                    <input
                      id="height-slider"
                      type="range"
                      min="64"
                      max="2048"
                      value={imageHeight}
                      onChange={(e) => setImageHeight(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Seed"
                      value={imageSeed}
                      onChange={(e) => setImageSeed(Number(e.target.value))}
                      disabled={useRandomSeed}
                    />
                    <Switch
                      checked={useRandomSeed}
                      onCheckedChange={setUseRandomSeed}
                    />
                    <span>Random</span>
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Image
                </Button>
              </form>
              {imageStatus === 'pending' && (
                <div className="mt-4 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              {imageResult && imageStatus === 'success' && (
                <div className="mt-4">
                  <Image
                    src={imageResult}
                    alt="Generated Image"
                    width={imageWidth}
                    height={imageHeight}
                    className="max-w-full h-auto"
                  />
                  <Button onClick={regenerateWithRandomSeed} className="mt-2">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Again with Random Seed
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Generate Text</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTextGeneration} className="space-y-4">
                <Textarea name="textPrompt" placeholder="Enter your prompt" required />
                <Select name="textModel">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {textModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                        <Badge variant={model.censored ? "default" : "destructive"} className="ml-2">
                          {model.censored ? "Censored" : "Uncensored (NSFW)"}
                        </Badge>
                        {model.paid && (
                          <Badge variant="secondary" className="ml-2">
                            Paid
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Text
                </Button>
              </form>
              {textResult && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <pre className="whitespace-pre-wrap">{textResult}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <button className="btn-github fixed bottom-5 left-[46%]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.99992 1.33331C7.12444 1.33331 6.25753 1.50575 5.4487 1.84078C4.63986 2.17581 3.90493 2.66688 3.28587 3.28593C2.03563 4.53618 1.33325 6.23187 1.33325 7.99998C1.33325 10.9466 3.24659 13.4466 5.89325 14.3333C6.22659 14.3866 6.33325 14.18 6.33325 14C6.33325 13.8466 6.33325 13.4266 6.33325 12.8733C4.48659 13.2733 4.09325 11.98 4.09325 11.98C3.78659 11.2066 3.35325 11 3.35325 11C2.74659 10.5866 3.39992 10.6 3.39992 10.6C4.06659 10.6466 4.41992 11.2866 4.41992 11.2866C4.99992 12.3 5.97992 12 6.35992 11.84C6.41992 11.4066 6.59325 11.1133 6.77992 10.9466C5.29992 10.78 3.74659 10.2066 3.74659 7.66665C3.74659 6.92665 3.99992 6.33331 4.43325 5.85998C4.36659 5.69331 4.13325 4.99998 4.49992 4.09998C4.49992 4.09998 5.05992 3.91998 6.33325 4.77998C6.85992 4.63331 7.43325 4.55998 7.99992 4.55998C8.56659 4.55998 9.13992 4.63331 9.66659 4.77998C10.9399 3.91998 11.4999 4.09998 11.4999 4.09998C11.8666 4.99998 11.6333 5.69331 11.5666 5.85998C11.9999 6.33331 12.2533 6.92665 12.2533 7.66665C12.2533 10.2133 10.6933 10.7733 9.20659 10.94C9.44659 11.1466 9.66659 11.5533 9.66659 12.1733C9.66659 13.0666 9.66659 13.7866 9.66659 14C9.66659 14.18 9.77325 14.3933 10.1133 14.3333C12.7599 13.44 14.6666 10.9466 14.6666 7.99998C14.6666 7.1245 14.4941 6.25759 14.1591 5.44876C13.8241 4.63992 13.333 3.90499 12.714 3.28593C12.0949 2.66688 11.36 2.17581 10.5511 1.84078C9.7423 1.50575 8.8754 1.33331 7.99992 1.33331V1.33331Z"
            fill="currentcolor"
          ></path>
        </svg>
        <a href="/https://github.com/suraj-xd/uncensored-image-text-generation" target="_blank" >View on Github</a>
      </button>

    </div>
  )
}