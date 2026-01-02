import { Mic, Book, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';

const features = [
  {
    title: 'Speaking',
    description: 'Practice your pronunciation with AI-powered feedback',
    icon: Mic,
    path: '/speaking',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Reading',
    description: 'Improve comprehension with interactive reading exercises',
    icon: Book,
    path: '/reading',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Writing',
    description: 'Enhance your writing skills with instant corrections',
    icon: PenTool,
    path: '/writing',
    color: 'bg-purple-500/10 text-purple-500',
  },
];

export default function Home() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Welcome to LinguaSense</h1>
          <p className="text-muted-foreground">
            Your AI-powered language learning companion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature) => (
            <Link key={feature.path} to={feature.path}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-8 p-6">
          <h2 className="text-2xl mb-4">Recent Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Speaking Practice</p>
                <p className="text-sm text-muted-foreground">
                  15 minutes today
                </p>
              </div>
              <div className="text-2xl font-semibold text-accent">75%</div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
