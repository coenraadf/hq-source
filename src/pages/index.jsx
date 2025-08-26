import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import NewEntry from "./NewEntry";

import Chat from "./Chat";

import Entries from "./Entries";

import CoachDashboard from "./CoachDashboard";

import Profile from "./Profile";

import EntryDetails from "./EntryDetails";

import SetupProfile from "./SetupProfile";

import ClientManagement from "./ClientManagement";

import CoachInvitation from "./CoachInvitation";

import Resources from "./Resources";

import ClientDetails from "./ClientDetails";

import Messages from "./Messages";

import MyCoach from "./MyCoach";

import CoachSchedule from "./CoachSchedule";

import CoachAnalytics from "./CoachAnalytics";

import Breakthroughs from "./Breakthroughs";

import CoachBreakthroughs from "./CoachBreakthroughs";

import PersonalityTests from "./PersonalityTests";

import NewPersonalityTest from "./NewPersonalityTest";

import EditPersonalityTest from "./EditPersonalityTest";

import Goals from "./Goals";

import ClientPricing from "./ClientPricing";

import CoachPricing from "./CoachPricing";

import AboutCoreCompass from "./AboutCoreCompass";

import AboutCoreCoach from "./AboutCoreCoach";

import TermsOfService from "./TermsOfService";

import MyNotes from "./MyNotes";

import PitchVision from "./PitchVision";

import PitchMarket from "./PitchMarket";

import PitchInvestors from "./PitchInvestors";

import PitchBeta from "./pitchbeta";

import pitchcontact from "./pitchcontact";

import ProfileEditor from "./ProfileEditor";

import Contact from "./Contact";

import CoachContact from "./CoachContact";

import CompassContact from "./CompassContact";

import CompassFAQ from "./CompassFAQ";

import CoachFAQ from "./CoachFAQ";

import MyHQHome from "./MyHQHome";

import AboutMyHQ from "./AboutMyHQ";

import AboutCoHQ from "./AboutCoHQ";

import MyHQContact from "./MyHQContact";

import CoHQContact from "./CoHQContact";

import CoHQPricing from "./CoHQPricing";

import MyHQFAQ from "./MyHQFAQ";

import CoHQFAQ from "./CoHQFAQ";

import CoachLanding from "./CoachLanding";

import CoachFeatures from "./CoachFeatures";

import ClientOnboarding from "./ClientOnboarding";

import EnterpriseSolutions from "./EnterpriseSolutions";

import InvestorOpportunity from "./InvestorOpportunity";

import CoachBetaSignup from "./CoachBetaSignup";

import RequestDemo from "./RequestDemo";

import BetaInvestorCircle from "./BetaInvestorCircle";

import NotFound from "./NotFound";

import Custom404 from "./404";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    NewEntry: NewEntry,
    
    Chat: Chat,
    
    Entries: Entries,
    
    CoachDashboard: CoachDashboard,
    
    Profile: Profile,
    
    EntryDetails: EntryDetails,
    
    SetupProfile: SetupProfile,
    
    ClientManagement: ClientManagement,
    
    CoachInvitation: CoachInvitation,
    
    Resources: Resources,
    
    ClientDetails: ClientDetails,
    
    Messages: Messages,
    
    MyCoach: MyCoach,
    
    CoachSchedule: CoachSchedule,
    
    CoachAnalytics: CoachAnalytics,
    
    Breakthroughs: Breakthroughs,
    
    CoachBreakthroughs: CoachBreakthroughs,
    
    PersonalityTests: PersonalityTests,
    
    NewPersonalityTest: NewPersonalityTest,
    
    EditPersonalityTest: EditPersonalityTest,
    
    Goals: Goals,
    
    ClientPricing: ClientPricing,
    
    CoachPricing: CoachPricing,
    
    AboutCoreCompass: AboutCoreCompass,
    
    AboutCoreCoach: AboutCoreCoach,
    
    TermsOfService: TermsOfService,
    
    MyNotes: MyNotes,
    
    PitchVision: PitchVision,
    
    PitchMarket: PitchMarket,
    
    PitchInvestors: PitchInvestors,
    
    PitchBeta: PitchBeta,
    
    pitchcontact: pitchcontact,
    
    ProfileEditor: ProfileEditor,
    
    Contact: Contact,
    
    CoachContact: CoachContact,
    
    CompassContact: CompassContact,
    
    CompassFAQ: CompassFAQ,
    
    CoachFAQ: CoachFAQ,
    
    MyHQHome: MyHQHome,
    
    AboutMyHQ: AboutMyHQ,
    
    AboutCoHQ: AboutCoHQ,
    
    MyHQContact: MyHQContact,
    
    CoHQContact: CoHQContact,
    
    CoHQPricing: CoHQPricing,
    
    MyHQFAQ: MyHQFAQ,
    
    CoHQFAQ: CoHQFAQ,
    
    CoachLanding: CoachLanding,
    
    CoachFeatures: CoachFeatures,
    
    ClientOnboarding: ClientOnboarding,
    
    EnterpriseSolutions: EnterpriseSolutions,
    
    InvestorOpportunity: InvestorOpportunity,
    
    CoachBetaSignup: CoachBetaSignup,
    
    RequestDemo: RequestDemo,
    
    BetaInvestorCircle: BetaInvestorCircle,
    
    NotFound: NotFound,
    
    404: 404,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/NewEntry" element={<NewEntry />} />
                
                <Route path="/Chat" element={<Chat />} />
                
                <Route path="/Entries" element={<Entries />} />
                
                <Route path="/CoachDashboard" element={<CoachDashboard />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/EntryDetails" element={<EntryDetails />} />
                
                <Route path="/SetupProfile" element={<SetupProfile />} />
                
                <Route path="/ClientManagement" element={<ClientManagement />} />
                
                <Route path="/CoachInvitation" element={<CoachInvitation />} />
                
                <Route path="/Resources" element={<Resources />} />
                
                <Route path="/ClientDetails" element={<ClientDetails />} />
                
                <Route path="/Messages" element={<Messages />} />
                
                <Route path="/MyCoach" element={<MyCoach />} />
                
                <Route path="/CoachSchedule" element={<CoachSchedule />} />
                
                <Route path="/CoachAnalytics" element={<CoachAnalytics />} />
                
                <Route path="/Breakthroughs" element={<Breakthroughs />} />
                
                <Route path="/CoachBreakthroughs" element={<CoachBreakthroughs />} />
                
                <Route path="/PersonalityTests" element={<PersonalityTests />} />
                
                <Route path="/NewPersonalityTest" element={<NewPersonalityTest />} />
                
                <Route path="/EditPersonalityTest" element={<EditPersonalityTest />} />
                
                <Route path="/Goals" element={<Goals />} />
                
                <Route path="/ClientPricing" element={<ClientPricing />} />
                
                <Route path="/CoachPricing" element={<CoachPricing />} />
                
                <Route path="/AboutCoreCompass" element={<AboutCoreCompass />} />
                
                <Route path="/AboutCoreCoach" element={<AboutCoreCoach />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/MyNotes" element={<MyNotes />} />
                
                <Route path="/PitchVision" element={<PitchVision />} />
                
                <Route path="/PitchMarket" element={<PitchMarket />} />
                
                <Route path="/PitchInvestors" element={<PitchInvestors />} />
                
                <Route path="/PitchBeta" element={<PitchBeta />} />
                
                <Route path="/PitchVision" element={<PitchVision />} />
                
                <Route path="/PitchMarket" element={<PitchMarket />} />
                
                <Route path="/PitchInvestors" element={<PitchInvestors />} />
                
                <Route path="/PitchBeta" element={<PitchBeta />} />
                
                <Route path="/pitchcontact" element={<pitchcontact />} />
                
                <Route path="/CompassFAQ" element={<CompassFAQ />} />
                
                <Route path="/CoachFAQ" element={<CoachFAQ />} />
                
                <Route path="/MyHQHome" element={<MyHQHome />} />
                
                <Route path="/AboutMyHQ" element={<AboutMyHQ />} />
                
                <Route path="/AboutCoHQ" element={<AboutCoHQ />} />
                
                <Route path="/MyHQContact" element={<MyHQContact />} />
                
                <Route path="/CoHQContact" element={<CoHQContact />} />
                
                <Route path="/CoHQPricing" element={<CoHQPricing />} />
                
                <Route path="/MyHQFAQ" element={<MyHQFAQ />} />
                
                <Route path="/CoHQFAQ" element={<CoHQFAQ />} />
                
                <Route path="/CoachLanding" element={<CoachLanding />} />
                
                <Route path="/CoachFeatures" element={<CoachFeatures />} />
                
                <Route path="/ClientOnboarding" element={<ClientOnboarding />} />
                
                <Route path="/EnterpriseSolutions" element={<EnterpriseSolutions />} />
                
                <Route path="/InvestorOpportunity" element={<InvestorOpportunity />} />
                
                <Route path="/CoachBetaSignup" element={<CoachBetaSignup />} />
                
                <Route path="/RequestDemo" element={<RequestDemo />} />
                
                <Route path="/BetaInvestorCircle" element={<BetaInvestorCircle />} />
                
                <Route path="/NotFound" element={<NotFound />} />
                
                <Route path="/404" element={<Custom404 />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}