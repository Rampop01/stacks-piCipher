const fs = require('fs');

const celoDir = '/Users/a/game/celo/frontend/src/app';
const stacksDir = '/Users/a/game/stacks/frontend/src/app';
const stacksCompDir = '/Users/a/game/stacks/frontend/src/components';

// Copy globals.css
let globals = fs.readFileSync(`${celoDir}/globals.css`, 'utf8');
globals = globals.replace(/#35D07F/g, '#FF5500')
                 .replace(/53, 208, 127/g, '255, 85, 0')
                 .replace(/53,208,127/g, '255,85,0');
fs.writeFileSync(`${stacksDir}/globals.css`, globals);

// Copy layout.js
let layout = fs.readFileSync(`${celoDir}/layout.js`, 'utf8');
layout = layout.replace('Celo', 'Stacks');
fs.writeFileSync(`${stacksDir}/layout.js`, layout);

// Build HomePage.js from Celo's page.js
let page = fs.readFileSync(`${celoDir}/page.js`, 'utf8');
page = page.replace(/#35D07F/g, '#FF5500')
           .replace(/53, 208, 127/g, '255, 85, 0')
           .replace(/53,208,127/g, '255,85,0')
           .replace('CELO NETWORK', 'STACKS NETWORK')
           .replace('Celo Network', 'Stacks Network')
           .replace('Celo bounty', 'Stacks bounty')
           .replace('Celo tokens', 'STX tokens');

// Swap out Privy auth with Stacks Connect
page = page.replace('import { usePrivy } from "@privy-io/react-auth";', 
`import { AppConfig, UserSession, showConnect } from "@stacks/connect";

let userSession;
if (typeof window !== "undefined") {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  userSession = new UserSession({ appConfig });
}`);

page = page.replace('const { login, authenticated, user, logout } = usePrivy();', 
`const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userSession) return;
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => setUserData(data));
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const login = () => {
    if (!userSession) return;
    showConnect({
      appDetails: { name: "PicCipher", icon: window.location.origin + "/favicon.ico" },
      redirectTo: "/",
      onFinish: () => setUserData(userSession.loadUserData()),
      userSession,
    });
  };

  const logout = () => {
    if (!userSession) return;
    userSession.signUserOut("/");
    setUserData(null);
  };
  
  const authenticated = !!userData;`);

page = page.replace(`{user?.email?.address || user?.wallet?.address?.slice(0,6) + '...'}`, 
`{userData?.profile?.stxAddress?.mainnet?.slice(0,6) + '...'}`);

// Also rename the component export if needed, though it's default
page = page.replace('export default function Home()', 'export default function HomePage()');

fs.writeFileSync(`${stacksCompDir}/HomePage.js`, page);
console.log('UI Ported Successfully!');
