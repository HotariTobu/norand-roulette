import { Accelerator } from "./components/Accelerator"
import { Slider } from "./components/ui/slider"
import useLocalStorageState from "use-local-storage-state"
import { Textarea } from "./components/ui/textarea"
import { Wheel } from "./components/Wheel"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

function App() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = t('title')
  }, [t])

  const [acceleration, setAcceleration] = useLocalStorageState('acceleration', {
    defaultValue: 0.03
  })
  const [attenuation, setAttenuation] = useLocalStorageState('attenuation', {
    defaultValue: 0.001
  })

  const [labelText, setLabelText] = useLocalStorageState('labelText', {
    defaultValue: ''
  })

  const labels = labelText
    .split('\n')
    .map(label => label.trim())
    .filter(label => label.length > 0)

  return (
    <div className="gap-4 h-screen grid grid-rows-[auto_minmax(auto,_1fr)_auto] md:grid-cols-[minmax(auto,_1fr)_minmax(auto,_2fr)] md:grid-rows-[auto_minmax(auto,_1fr)]">
      <div className="m-2 space-y-4">
        <div className="text-lg md:text-xl">{t('candidacy.header')}</div>
        <Textarea className="md:text-lg" rows={8} value={labelText} onChange={e => setLabelText(e.target.value)} />
      </div>
      <div className="w-9/12 m-auto overflow-clip md:row-span-2">
        <Accelerator acceleration={acceleration} attenuation={attenuation} >
          <Wheel labels={labels} />
        </Accelerator>
      </div>
      <div className="m-2 space-y-4">
        <div className="text-lg md:text-xl">{t('options.header')}</div>
        <div className="flex">
          <div className="w-16">{t('options.acceleration')}</div>
          <Slider min={attenuation + 0.0001} max={0.1} step={0.0001} value={[acceleration]} onValueChange={v => setAcceleration(v[0])} />
        </div>
        <div className="flex">
          <div className="w-16">{t('options.attenuation')}</div>
          <Slider min={0.0001} max={0.01} step={0.00001} value={[attenuation]} onValueChange={v => setAttenuation(v[0])} />
        </div>
      </div>
    </div>
  )
}

export default App
