/**
 * Build sequence for each NDMA DRIM model.
 * Steps follow the materials on that model's board and the rules already used in
 * this portal: continuous bands (ERRA / confined masonry), a tied light roof,
 * drainage behind slopes, a damp-proof course and scour-safe foundations in flood
 * country, and no seawater in concrete. They are a method, not a site-specific design.
 */
import type { DrimSystem } from "./drim";

export type BuildStep = { title: string; detail: string };

export type ModelBuild = {
  principle: string;
  steps: BuildStep[];
};

export const systemPlate: Record<DrimSystem, { src: string; caption: string }> = {
  "timber-bamboo": {
    src: "/construction/timber.jpg",
    caption: "Timber or bamboo frame first, infill second, light roof tied to the top band.",
  },
  masonry: {
    src: "/construction/masonry.jpg",
    caption: "Plinth band, tie columns and a lintel band so the masonry works as one box.",
  },
  earth: {
    src: "/construction/earth.jpg",
    caption: "Earth lifted in courses, with reinforcement and a band at the head of the wall.",
  },
  "light-frame": {
    src: "/construction/frame.jpg",
    caption: "A light frame bolted to the plinth, then sheathing and a diaphragm roof.",
  },
  elevated: {
    src: "/construction/elevated.jpg",
    caption: "The living floor is held above flood level; water is given a path underneath.",
  },
  slope: {
    src: "/construction/slope.jpg",
    caption: "Geogrid and compacted fill, with a drain at the heel, before any building behind the crest.",
  },
};

const band = "Plinth, sill, lintel and roof levels stay tied together. A wall without that continuity is not this model.";

export const modelBuilds: Record<string, ModelBuild> = {
  "loh-kaat-timber-house-structure": {
    principle: "The timber kaat is the structure. Mud mortar only fills the frame.",
    steps: [
      { title: "Foundation on firm ground", detail: "Excavate to firm ground below frost and scour. On a slope, step the foundation. Do not perch the house on loose fill at a cut edge." },
      { title: "Plinth and first band", detail: "Lay a level plinth with a damp-proof course, then set the posts and the first horizontal kaat so the frame is tied before any infill." },
      { title: "Infill in lifts", detail: "Raise stone in mud mortar inside the frame, with through-stones, and add the next kaat at sill and lintel height so the wall cannot peel off the timber." },
      { title: "Light roof, tied down", detail: "Fix timber beams and a wood or CGI roof, strapped to the top band, pitched to shed snow. Do not replace it with a heavy mud or stone roof." },
    ],
  },
  "timber-frame-lath-plaster": {
    principle: "A timber frame carries the load. Lath and plaster is a finish, not the structure.",
    steps: [
      { title: "Frame the box", detail: "Set timber posts and beams on a level plinth, with horizontal members at sill and head so the frame is stable before cladding." },
      { title: "Fix the laths", detail: "Nail timber laths to the frame at a spacing the plaster can key into. Keep openings away from the corners." },
      { title: "Plaster in two coats", detail: "Apply cement mortar in thin coats so it cures without a single thick skin that cracks off the lath." },
      { title: "CGI roof tied to the frame", detail: "Strap the CGI roof to the top of the frame, with an overhang that throws water clear of the plaster." },
    ],
  },
  "bamboo-frame-wattle-daub": {
    principle: "Bamboo is the frame. Wattle and mud daub only close the wall.",
    steps: [
      { title: "Select and set the poles", detail: "Use mature bamboo poles, treated against rot, set on a raised plinth so the feet stay dry. Brace the frame in both directions before daubing." },
      { title: "Weave the wattle", detail: "Split bamboo strips are woven between the poles. They are the key for the mud, not a substitute for the poles." },
      { title: "Daub in thin layers", detail: "Mud mixed with straw goes on in thin layers and is left to dry between coats. A thick wet coat slumps and cracks." },
      { title: "Light roof on a timber plate", detail: "A wooden strip roof is tied to a plate on top of the poles and pitched to shed rain and snow." },
    ],
  },
  "cement-bamboo-frame-structure": {
    principle: "Bamboo plus wire mesh and cement plaster, still a light frame, not a masonry wall.",
    steps: [
      { title: "Raise the bamboo frame", detail: "Set the bamboo structural frame on a plinth, braced, with the feet kept clear of standing water." },
      { title: "Fix the mesh", detail: "Stretch wire mesh over the frame and tie it at close centres so the plaster has a continuous reinforcement." },
      { title: "Plaster both faces", detail: "Cement plaster goes on in coats thin enough to cure. The mesh must stay inside the plaster, not on the face." },
      { title: "CGI roof strapped down", detail: "CGI sheets are fixed to the roof members and strapped to the top of the frame so wind cannot peel them." },
    ],
  },
  "confined-concrete-block-masonry-structure": {
    principle: band,
    steps: [
      { title: "Plinth band", detail: "Cast a reinforced plinth band on the foundation so every wall starts from one tied line." },
      { title: "Tie columns first", detail: "Stand the corner and junction steel, then lay solid concrete blocks in cement-sand mortar up to sill level. The columns confine the panels; they are not added afterwards." },
      { title: "Sill, lintel and roof bands", detail: "Cast the sill band, continue the columns, then the lintel and roof bands so openings have a frame of concrete around them." },
      { title: "Roof diaphragm", detail: "Tie the roof to the roof band. A heavy untied roof undoes the confinement." },
    ],
  },
  "interlocking-brick-masonry-structure": {
    principle: "Hollow interlocking bricks save mortar. The 12 mm bars and the concrete bands are what hold the box.",
    steps: [
      { title: "Plinth band", detail: "Cast the concrete plinth band level. Interlocking courses cannot correct a twisted start." },
      { title: "Dry-stack, then grout the bars", detail: "Lay hollow bricks in the interlock. Drop the 12 mm bars at corners and junctions and fill those cores. Do not leave the bars dry." },
      { title: "Lintel and roof bands", detail: "Cast the lintel and roof bands called for on the model so the bars and the bricks act together." },
      { title: "Check the bond", detail: "A broken interlock or a missing bar at a corner is rebuilt, not plastered over." },
    ],
  },
  "rat-trap-bond-masonry-structure": {
    principle: "Bricks on edge make a cavity and a lighter wall. The cavity is where the seismic steel goes, not a void left empty in a seismic area.",
    steps: [
      { title: "Set out the cavity bond", detail: "Lay burnt clay bricks on edge in cement mortar so the cavity is continuous. Keep the bond true; a wandering cavity cannot take a bar." },
      { title: "Steel where the model calls for it", detail: "Where seismic reinforcement is required, place the bars and concrete in the cavity at corners and junctions, with RCC lintel and roof bands." },
      { title: "Keep the cavity honest", detail: "Do not fill the whole cavity with mortar. The point of the bond is the lighter wall and the insulation of the air gap between the reinforced cores." },
      { title: "Roof on the band", detail: "The roof lands on the roof band, not on the thin brick edge alone." },
    ],
  },
  "fly-ash-masonry-structure": {
    principle: "Fly-ash bricks are the unit. Confinement is still the reinforced bands and lintels.",
    steps: [
      { title: "Plinth and damp-proof course", detail: "Start from a level plinth and a damp-proof course. Uniform bricks will show every twist in the base." },
      { title: "Lay in cement mortar", detail: "Lay fly-ash bricks in cement mortar, full joints, openings kept clear of corners." },
      { title: "Bands and lintels", detail: "Cast reinforced-concrete bands and lintels at plinth, lintel and roof so the wall is confined." },
      { title: "Cure the mortar", detail: "Keep the work moist while the mortar cures. A hot, dry wind starves the joint and the band." },
    ],
  },
  "earthbag-masonry-structure": {
    principle: "Each course is a compacted ring, locked to the one below. The wall is not a stack of loose bags.",
    steps: [
      { title: "A trench foundation", detail: "Start in a shallow trench of compacted fill on firm ground, wider than the bag, so the first course cannot kick out." },
      { title: "Fill, lay, tamp", detail: "Fill polypropylene bags with local soil or stone dust, lay them in a running bond, and tamp each course before the next." },
      { title: "Bar between courses", detail: "Place the steel bar the model specifies between courses, continuous around corners, so the rings cannot slide apart." },
      { title: "RC lintel and band", detail: "Openings get an RC lintel, and the top of the wall gets a band, before the roof is set." },
    ],
  },
  "reinforced-adobe-brick-structure": {
    principle: "Stabilised adobe with mesh and bands. Unreinforced mud brick is a different, weaker wall.",
    steps: [
      { title: "Stabilise the bricks", detail: "Make bricks from local soil with the cement or lime stabilisation the model uses, and cure them before laying." },
      { title: "Lay with the mesh in the joints", detail: "Bed the bricks and run the wire mesh in the horizontal joints so a crack has steel to cross it." },
      { title: "Bands and lintels", detail: "Cast RCC bands and lintels at the heads of openings and at the top of the wall." },
      { title: "A light, tied roof", detail: "Keep the roof light and tie it to the top band. A heavy earth roof on adobe is not this model." },
    ],
  },
  "light-gauge-steel-house-structure": {
    principle: "Thin steel works only when every stud is screwed to the track and the roof diaphragm is complete.",
    steps: [
      { title: "Anchor the base track", detail: "Fix the galvanised base track to the plinth with anchors at the centres the supplier specifies. A floating track is not a frame." },
      { title: "Studs, heads and bracing", detail: "Screw studs to top and bottom tracks, add bracing, and keep openings inside a header so the wall still racks as a frame." },
      { title: "Sheathing", detail: "Fix the PVC or board sheathing to the studs. Sheathing is part of the racking resistance, not a decoration added later." },
      { title: "Light roof, screwed down", detail: "Screw the lightweight sheets through to the purlins. Edge and ridge fixings are closer than the field, the same rule used on wind-exposed roofs." },
    ],
  },
  "pre-fabricated-house-structure": {
    principle: "Panels arrive square. The site work is the joints, the anchor and the seal.",
    steps: [
      { title: "A true plinth", detail: "Cast the plinth level and square. A twisted base opens every panel joint." },
      { title: "Anchor, then stand panels", detail: "Anchor the base, stand insulated wall panels in order, and bolt the joints before the next panel leans on them." },
      { title: "Roof panels as a diaphragm", detail: "Set the insulated roof panels and fix them to the wall heads so the roof ties the box." },
      { title: "Seal the joints", detail: "Close joints against rain before occupation. An open joint puts water into the insulation." },
    ],
  },
  "elevated-flood-resilient-house-structure": {
    principle: "The ground storey is a flood path. Only the upper floor is the house.",
    steps: [
      { title: "Foundations below scour", detail: "Take column foundations below scour depth, on firm ground, clear of the active channel." },
      { title: "Columns before the slab", detail: "Cast the RCC columns to the flood-free level and cure them. Do not wall in the ground storey." },
      { title: "Raised slab", detail: "Cast the slab on the columns with a damp-proof layer. Services that must stay dry — boards, meters, pumps — sit at this level, not below it." },
      { title: "Light walls and a tied roof", detail: "Walls of timber, brick or light panels start on the slab. The roof is tied down. Materials in the flood path are the ones the model rates for moisture." },
    ],
  },
  "raised-plinth-flood-resilient-house": {
    principle: "The plinth is a dry platform. It is not a low kerb.",
    steps: [
      { title: "Compacted fill", detail: "Build the plinth from compacted fill or concrete bricks, broad enough not to slump when wet, and above the flood level the site is planned for." },
      { title: "Waterproof the top", detail: "Lay the waterproofing the model calls for across the top of the plinth, turned up at the edges." },
      { title: "Walls on the dry platform", detail: "Start the wooden or masonry walls on that platform, with a damp-proof course, so floodwater meets the plinth and not the wall base." },
      { title: "Hold the roof down", detail: "Tie the roof to the walls. A raised house with a loose roof fails in the wind that comes with the flood." },
    ],
  },
  "floating-amphibious-structure": {
    principle: "It must rise freely. A porch, a pipe or a chain that ties it down defeats the model.",
    steps: [
      { title: "A guide frame", detail: "Set a steel or RC guide frame, founded below scour, tall enough for the design rise. The house slides on the guides; it is not nailed to them." },
      { title: "Buoyancy that cannot flood", detail: "Fix the sealed plastic drums under the floor so they stay trapped if one fitting fails. Test that the chassis is level." },
      { title: "A light superstructure", detail: "Build the timber or bamboo house on that chassis. Keep it light. A masonry upper floor is not this model." },
      { title: "Services that can move", detail: "Water, power and waste connections must have slack for the rise. A rigid pipe will hold the house down or tear out." },
    ],
  },
  "geogrid-reinforced-retaining-wall-structure": {
    principle: "The geogrid and the compacted fill are the wall. The face is only a finish.",
    steps: [
      { title: "A drained base", detail: "Excavate to firm ground, lay a level base, and place the drainage pipe at the heel before the first layer." },
      { title: "Fill in thin layers", detail: "Spread granular fill in thin layers, lay the geogrid back into the slope at the spacing designed for that height, and compact each layer." },
      { title: "Wrap or face the front", detail: "Form the face as the layers rise. Do not build a tall loose face and hope the grid catches it later." },
      { title: "Set the building back", detail: "Any house sits behind the crest, clear of the wall and of the cut. The wall protects a slope; it is not a foundation for a building on its face." },
    ],
  },
};
