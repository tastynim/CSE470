import React from 'react';
import Payment_front from './Payment_front';
import Resource_front from './resource_front';
import Skill_upload_front from './skill_upload_front';
import Discuss_front from './discuss_front';
import Mentor_front from './mentor_front';
import Admin_approve_front from './admin_approve_front';

const routes = {
  '/':            <Payment_front />,
  '/payment':     <Payment_front />,
  '/resources':   <Resource_front />,
  '/skill-upload':<Skill_upload_front />,
  '/forum':       <Discuss_front />,
  '/mentorship':  <Mentor_front />,
  '/admin':       <Admin_approve_front />,
};

function App() {
  const path = window.location.pathname;
  return routes[path] || (
    <div style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '60px 20px' }}>
      <h2>404 – Page not found</h2>
      <p>Available pages:</p>
      <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
        {Object.keys(routes).map(r => (
          <li key={r}><a href={r} style={{ color: '#2da84a' }}>{r}</a></li>
        ))}
      </ul>
    </div>
  );
}

export default App;
