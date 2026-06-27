import { useState } from 'react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Search } from 'lucide-react';

function App() {
  const [amount, setAmount] = useState('');

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-12">
      <header className="border-b-4 border-ink pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-6xl text-crimson mb-2">UI KIT</h1>
          <p className="font-mono text-lg font-bold uppercase">Neo-Brutalism System</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold uppercase bg-gold inline-block px-2 border-2 border-ink">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary CTA</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger Zone</Button>
            <Button variant="ghost">Ghost Link</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold uppercase bg-crimson text-white inline-block px-2 border-2 border-ink">
            Tags & Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default Pill</Badge>
            <Badge variant="crimson">Expense</Badge>
            <Badge variant="gold">Warning</Badge>
            <Badge variant="ink">Income</Badge>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-display font-bold uppercase bg-white inline-block px-2 border-2 border-ink">
            Inputs & Forms
          </h2>
          <div className="space-y-4 max-w-sm">
            <Input placeholder="Standard text input..." />
            <Input 
              icon={<Search size={20} />} 
              placeholder="Search ideas, transactions..." 
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-ink">₹</span>
              <Input 
                className="pl-8 font-mono text-lg" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Input disabled placeholder="Disabled state" />
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-display font-bold uppercase bg-paper inline-block px-2 border-2 border-ink shadow-brutal-sm">
            Cards & Containers
          </h2>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Netflix Subscription</CardTitle>
                <Badge variant="crimson">Subscription</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="font-mono text-3xl font-bold">₹649.00</p>
                  <p className="text-sm text-ink/70 mt-1 font-bold">Paid via UPI</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="font-mono text-sm">Oct 24, 2026</span>
              <Button size="sm" variant="secondary">Edit</Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default App;
