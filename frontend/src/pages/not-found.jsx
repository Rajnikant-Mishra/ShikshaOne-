import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-red-950 p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <AlertTriangle className="mx-auto h-24 w-24 text-red-500" />
        <h1 className="mt-8 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
          404
        </h1>
        <p className="mt-4 text-2xl font-medium text-gray-700 dark:text-gray-300">
          Oops! Page Not Found
        </p>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/">
            <Button size="lg">
              <Home className="mr-2 h-5 w-5" />
              Go back home
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </motion.div>
      <div className="absolute bottom-8 text-sm text-gray-500 dark:text-gray-400">
        If you believe this is an error, please contact support.
      </div>
    </div>
  );
};

export default NotFound;