import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import { Button } from './components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import ProjectsPage from './pages/projects.page';
import UnityVersionsPage from './pages/unity-versions.page';
import { cn } from './lib/utils';

function App() {
  const buttonClass =
    'flex justify-start gap-2 px-4 py-2 rounded-md bg-transparent text-foreground hover:bg-white/5 transition-colors';

  const buttonClassNav = ({ isActive }: { isActive: boolean }) =>
    cn(buttonClass, isActive && 'bg-white/5');

  return (
    <>
      <BrowserRouter>
        <main className='flex-1 flex w-full'>
          <nav className='bg-neutral-900 text-white p-3 flex flex-col gap-4 sticky top-0 h-screen'>
            <h2 className='text-lg font-semibold'>Unity Launcher</h2>
            <div className='flex flex-col gap-2 mt-8'>
              <NavLink to='/' className={buttonClassNav}>
                <span>Projects</span>
              </NavLink>
              <NavLink to='/unity-versions' className={buttonClassNav}>
                <span>Unity Versions</span>
              </NavLink>
            </div>
            <footer className='mt-auto'>
              <Button className={buttonClass} asChild>
                <a href='https://www.github.com/kazte' target='_blank'>
                  <GitHubLogoIcon />
                  Github
                </a>
              </Button>
            </footer>
          </nav>
          <section className='flex-grow flex flex-col'>
            <Routes>
              <Route path='/' element={<ProjectsPage />} />
              <Route path='/unity-versions' element={<UnityVersionsPage />} />
            </Routes>
          </section>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
