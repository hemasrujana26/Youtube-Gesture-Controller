import { motion } from 'framer-motion';
import {
  ComputerDesktopIcon,
  HandRaisedIcon,
  CommandLineIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'OpenCV',
    description: 'Real-time webcam input and image processing for accurate gesture detection.',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'MediaPipe Hands',
    description: 'Advanced hand landmark detection for precise finger tracking and gesture recognition.',
    icon: HandRaisedIcon,
  },
  {
    name: 'PyAutoGUI',
    description: 'Simulates keyboard inputs to control YouTube playback and navigation.',
    icon: CommandLineIcon,
  },
  {
    name: 'Cooldown System',
    description: 'Prevents accidental repeated actions with smart timing controls.',
    icon: ClockIcon,
  },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">How It Works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Technology Behind the Magic
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our system combines cutting-edge computer vision and machine learning to create
            a seamless gesture control experience for YouTube.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 