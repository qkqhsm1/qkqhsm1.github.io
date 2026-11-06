// Research page copy. Draft by Claude, pending Soomin's review.

export type ResearchFigure = 'cell' | 'grid' | 'bayes'

export const researchAreas: { title: string; summary: string; figure: ResearchFigure; link?: { to: string; label: string } }[] = [
  {
    title: 'Electrochemical Modeling',
    figure: 'cell',
    summary:
      'Cell voltage and heat follow from coupled processes: lithium diffusion inside electrode particles, ion transport through the electrolyte, and reaction kinetics at the particle surface. I work with models of these processes at several levels of detail, from the pseudo-two-dimensional (P2D) model to single-particle models with electrolyte dynamics (SPMe), and study how electrode geometry and temperature change the predicted response.',
  },
  {
    title: 'Electrochemical Simulation',
    figure: 'grid',
    summary:
      'A model is usable in a battery management system only if it solves quickly and stays stable over long, dynamic load profiles. I develop numerical schemes for these models, including finite-volume discretization, time integration, and non-iterative solution methods, and compare reduced models with P2D results under constant-current and driving-cycle loads.',
    link: { to: '/battery-sim', label: 'Run the SPMe solver in Battery Sim →' },
  },
  {
    title: 'Physics-based Parameter Identification',
    figure: 'bayes',
    summary:
      'Most model parameters cannot be measured directly and have to be estimated from voltage and temperature data. I estimate them with Bayesian methods such as Markov chain Monte Carlo and variational inference, and check which parameters the available data can determine, so that each estimate is reported with its uncertainty.',
  },
]
