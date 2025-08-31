import { motion } from 'framer-motion';

const gestures = [
  {
    name: 'Play',
    description: 'All fingers except thumb',
    action: 'Starts video playback',
  },
  {
    name: 'Pause',
    description: 'Open palm',
    action: 'Pauses video playback',
  },
  {
    name: 'Volume Up',
    description: 'Two fingers (index & middle)',
    action: 'Increases volume',
  },
  {
    name: 'Volume Down',
    description: 'Ring & pinky fingers',
    action: 'Decreases volume',
  },
  {
    name: 'Next Video',
    description: 'Thumb only',
    action: 'Skips to next video',
  },
  {
    name: 'Previous Video',
    description: 'Thumb & pinky',
    action: 'Returns to previous video',
  },
];

export default function Gestures() {
  return (
    <div id="gestures" className="bg-white py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Gestures</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Control YouTube with Simple Hand Gestures
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our intuitive gesture system makes controlling YouTube as natural as waving your hand.
            No complex movements required.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            {gestures.map((gesture) => (
              <motion.div
                key={gesture.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col rounded-2xl bg-gray-50 p-8 shadow-sm ring-1 ring-gray-200"
              >
                <h3 className="text-lg font-semibold leading-8 text-gray-900">{gesture.name}</h3>
                <p className="mt-2 text-base leading-7 text-gray-600">{gesture.description}</p>
                <p className="mt-4 text-sm font-medium text-primary-600">{gesture.action}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 