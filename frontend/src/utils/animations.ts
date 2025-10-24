import type { Variants } from 'framer-motion';


import { motion } from 'framer-motion';export const fadeIn: Variants = {

  initial: { opacity: 0 },

interface Props {  animate: { opacity: 1 },

  children: ReactNode;  exit: { opacity: 0 },

  fallback?: ReactNode;};

}

export const fadeInUp: Variants = {

interface State {  initial: { opacity: 0, y: 20 },

  hasError: boolean;  animate: { 

  error: Error | null;    opacity: 1, 

}    y: 0,

    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

export class ErrorBoundary extends Component<Props, State> {  },

  constructor(props: Props) {  exit: { opacity: 0, y: -20 },

    super(props);};

    this.state = { hasError: false, error: null };

  }export const fadeInDown: Variants = {

  initial: { opacity: 0, y: -20 },

  static getDerivedStateFromError(error: Error): State {  animate: { 

    return { hasError: true, error };    opacity: 1, 

  }    y: 0,

    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {  },

    console.error('ErrorBoundary caught:', error, errorInfo);  exit: { opacity: 0, y: 20 },

  }};



  handleReset = () => {export const scaleIn: Variants = {

    this.setState({ hasError: false, error: null });  initial: { scale: 0.8, opacity: 0 },

  };  animate: { 

    scale: 1, 

  render() {    opacity: 1,

    if (this.state.hasError) {    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }

      if (this.props.fallback) {  },

        return this.props.fallback;  exit: { scale: 0.8, opacity: 0 },

      }};



      return (export const slideInLeft: Variants = {

        <motion.div  initial: { x: -50, opacity: 0 },

          initial={{ opacity: 0, scale: 0.9 }}  animate: { 

          animate={{ opacity: 1, scale: 1 }}    x: 0, 

          className="min-h-screen bg-primary flex items-center justify-center p-6"    opacity: 1,

        >    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

          <div className="max-w-md w-full bg-secondary border-2 border-error rounded-lg p-8 text-center space-y-6">  },

            <div className="w-20 h-20 mx-auto rounded-full bg-error/20 flex items-center justify-center">  exit: { x: 50, opacity: 0 },

              <AlertTriangle size={40} className="text-error" />};

            </div>

            export const slideInRight: Variants = {

            <div>  initial: { x: 50, opacity: 0 },

              <h1 className="text-2xl font-bold text-white title-font mb-2">  animate: { 

                Something Went Wrong    x: 0, 

              </h1>    opacity: 1,

              <p className="text-secondary text-sm">    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

                {this.state.error?.message || 'An unexpected error occurred'}  },

              </p>  exit: { x: -50, opacity: 0 },

            </div>};



            <buttonexport const staggerContainer: Variants = {

              onClick={this.handleReset}  animate: {

              className="w-full py-3 bg-error hover:bg-error/80 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"    transition: {

            >      staggerChildren: 0.1,

              <RefreshCw size={20} />      delayChildren: 0.2,

              Try Again    },

            </button>  },

          </div>};

        </motion.div>

      );export const staggerItem: Variants = {

    }  initial: { opacity: 0, y: 20 },

  animate: { 

    return this.props.children;    opacity: 1, 

  }    y: 0,

}    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

  },
};

export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
};

export const tapScale = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  },
};
