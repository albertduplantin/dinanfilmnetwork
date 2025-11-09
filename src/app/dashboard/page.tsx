import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function Dashboard() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return <div>Utilisateur non trouvé</div>;
  }

  // Vérifier si l'utilisateur existe dans notre DB
  let user = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);

  if (user.length === 0) {
    // Créer l'utilisateur dans notre DB
    await db.insert(users).values({
      clerkId: clerkUser.id,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      role: 'mentee', // Par défaut mentee, peut être changé
    });
    user = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
  }

  const dbUser = user[0];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bienvenue, {dbUser.name} !</h2>
        <p className="mb-4">Rôle : {dbUser.role}</p>
        <p className="mb-4">Email : {dbUser.email}</p>
        {dbUser.bio && <p className="mb-4">Bio : {dbUser.bio}</p>}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/profile" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700">
              Modifier mon profil
            </a>
            <a href="/mentorship" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700">
              Sessions de mentorat
            </a>
            <a href="/resources" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
              Aides et ressources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}