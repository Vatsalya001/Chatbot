export default function HomePage() {
  const features = [
    {
      title: "🔐 Secure Authentication",
      description: "JWT-based authentication with refresh tokens and secure password hashing"
    },
    {
      title: "💬 Nested Comments",
      description: "Multi-level comment threading with unlimited depth using materialized paths"
    },
    {
      title: "⏰ 15-Minute Edit Window",
      description: "Comments can be edited within 15 minutes of posting with version history"
    },
    {
      title: "🗑️ Graceful Deletion",
      description: "Delete and restore comments within 15 minutes, preserving thread structure"
    },
    {
      title: "🔔 Real-time Notifications",
      description: "Get notified when someone replies to your comments with read/unread status"
    },
    {
      title: "⚡ High Performance",
      description: "Redis caching, database optimization, and efficient nested queries"
    }
  ]

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Comment App
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A highly scalable comment system built with backend focus, emphasizing performance and clean architecture
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href={`${apiUrl}/api/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-6 py-3 text-base"
          >
            📚 View API Documentation
          </a>
          <a 
            href={`${apiUrl}/health`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary px-6 py-3 text-base"
          >
            🏥 Health Check
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="card p-6">
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">🚀 Getting Started</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Backend API Endpoints:</h3>
            <div className="bg-muted/50 p-4 rounded-md font-mono text-xs space-y-1">
              <div><strong>POST</strong> /api/auth/register - User registration</div>
              <div><strong>POST</strong> /api/auth/login - User login</div>
              <div><strong>GET</strong> /api/comments - List comments with pagination</div>
              <div><strong>POST</strong> /api/comments - Create new comment</div>
              <div><strong>PUT</strong> /api/comments/:id - Edit comment (15-min window)</div>
              <div><strong>DELETE</strong> /api/comments/:id - Delete comment (15-min window)</div>
              <div><strong>GET</strong> /api/notifications - User notifications</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Example Usage:</h3>
            <div className="bg-muted/50 p-4 rounded-md font-mono text-xs">
              <div># Register a new user</div>
              <div>curl -X POST {apiUrl}/api/auth/register \</div>
              <div className="ml-4">-H "Content-Type: application/json" \</div>
              <div className="ml-4">-d '{"username":"john","email":"john@example.com","password":"password123"}'</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-4">🏗️ Architecture Highlights</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Backend Stack</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• NestJS with TypeScript</li>
              <li>• PostgreSQL with TypeORM</li>
              <li>• Redis for caching</li>
              <li>• JWT authentication</li>
              <li>• Rate limiting & security</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Materialized path for nested comments</li>
              <li>• Connection pooling for scalability</li>
              <li>• Optimized database indexes</li>
              <li>• Docker containerization</li>
              <li>• Health monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}