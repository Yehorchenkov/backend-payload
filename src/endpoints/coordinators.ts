import { Endpoint } from 'payload'

const coordinatorsEndpoint: Endpoint = {
  path: '/coordinators',
  method: 'get',
  // Note: The 'res' and 'next' parameters might not be used when returning Response objects
  handler: async (req) => {
    const payload = req.payload
    try {
      const { docs: projects } = await payload.find({
        collection: 'projects',
        where: { coordinator: { exists: true } },
        depth: 0,
        req,
        select: {
          coordinator: true,
        },
      })
      const coordIds = Array.from(new Set(projects.map((p) => String((p as any).coordinator))))
      if (coordIds.length === 0) {
        // Return a Response object
        return Response.json([], { status: 200 })
      }
      const { docs: users } = await payload.find({
        collection: 'users',
        where: { id: { in: coordIds } },
        req,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      })
      // Return a Response object
      return Response.json(users, { status: 200 })
    } catch (err) {
      console.error('Error in /coordinators endpoint:', err)
      // Return a Response object for the error
      const message = err instanceof Error ? err.message : 'Internal Server Error'
      // Attempt to get status from error, default to 500
      const status =
        typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
          ? err.status
          : 500
      return Response.json({ message: message }, { status: status })
    }
  },
}

export default coordinatorsEndpoint
