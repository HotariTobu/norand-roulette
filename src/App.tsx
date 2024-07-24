import { Accelerator } from "./components/Accelerator"
import { Slider } from "./components/ui/slider"
import useLocalStorageState from "use-local-storage-state"
import { Textarea } from "./components/ui/textarea"
import { Wheel } from "./components/Wheel"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

const defaultItemText = [1, 2, 3].join('\n')

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

  const [itemText, setItemText] = useLocalStorageState('itemText', {
    defaultValue: defaultItemText
  })

  const items = itemText
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0)

  return (
    <div className="gap-4 h-screen grid grid-rows-[auto_minmax(auto,_1fr)_auto_auto] md:grid-cols-[minmax(auto,_1fr)_minmax(auto,_2fr)] md:grid-rows-[auto_minmax(auto,_1fr)_auto]">
      <div className="m-2 space-y-2 md:space-y-4">
        <div className="text-lg md:text-xl">{t('items.header')}</div>
        <Textarea className="md:text-lg" rows={8} value={itemText} onChange={e => setItemText(e.target.value)} />
      </div>
      <div className="w-3/4 md:max-w-[90vh] m-auto select-none overflow-clip relative md:row-span-2">
        <Accelerator acceleration={acceleration} attenuation={attenuation} >
          <Wheel items={items} />
        </Accelerator>
        <div className="absolute inset-0 pointer-events-none">
          <svg viewBox="-6 -6 12 12">
            <g transform="rotate(-45)">
              <g transform="translate(5.3, 0)">
                <polygon points="0, 0 3, -1 3, 1" transform="scale(0.3)" strokeWidth="0.1" stroke="black" fill="white" />
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className="m-2 space-y-2 md:space-y-4">
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
      <div className="m-2 space-y-2 md:space-y-4 md:col-span-2">
        <div className="text-lg md:text-xl">{t('how-to-use.header')}</div>
        <div>{t('how-to-use.body')}</div>
      </div>
    </div>
  )
}

export default App
