import { CodeBracketIcon, ChatBubbleLeftRightIcon, LinkIcon } from '@heroicons/react/24/outline';

const navigation = {
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com/yourusername',
      icon: CodeBracketIcon,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/yourusername',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/yourusername',
      icon: LinkIcon,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} YouTube Gesture Controller. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 