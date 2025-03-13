import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About This Blog</h1>

        <Card>
          <CardContent className="p-6 prose prose-lg dark:prose-invert">
            <p>
              Welcome to my Python learning journey blog! This space is dedicated to sharing
              my experiences, insights, and discoveries as I explore the Python programming
              language and its vast ecosystem.
            </p>

            <h2>What You'll Find Here</h2>
            <ul>
              <li>Detailed tutorials and guides on Python programming concepts</li>
              <li>Best practices and coding patterns I've learned along the way</li>
              <li>Real-world examples and practical applications</li>
              <li>Tips and tricks for becoming a better Python developer</li>
            </ul>

            <h2>Learning Together</h2>
            <p>
              Programming is a journey of continuous learning and improvement. By sharing my
              experiences and the knowledge I've gained, I hope to help others on their
              own Python learning journey while also strengthening my understanding through
              teaching and discussion.
            </p>

            <h2>Get in Touch</h2>
            <p>
              Have questions, suggestions, or just want to connect? Feel free to reach out
              through the comments on any post or follow me on social media. Let's learn
              and grow together!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
