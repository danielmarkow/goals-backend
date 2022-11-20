const asyncHandler = require("express-async-handler");
const { prisma } = require("../config/db");

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await prisma.goal.findMany({
    where: { authorId: req.user.id },
  });
  res.status(200).json(goals);
});

// @desc    Set goals
// @route   POST /api/goals
// @access  Private
const setGoals = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const goal = await prisma.goal.create({
    data: {
      goaltext: req.body.text,
      authorId: req.user.id,
    },
  });
  res.status(200).json(goal);
});

// @desc    Put goals
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goalId = req.params.id;

  const goal = await prisma.goal.findFirst({
    where: { id: goalId },
  });

  const user = await prisma.user.findFirst({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // make sure the login user matches the goal user
  if (goal.authorId !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  try {
    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: { goaltext: req.body.text },
    });
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc    Delete goals
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goalId = req.params.id;

  const goal = await prisma.goal.findFirst({
    where: { id: req.params.id },
  });

  const user = await prisma.user.findFirst({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // make sure the login user matches the goal user
  if (goal.authorId !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  try {
    const deletedGoal = await prisma.goal.delete({
      where: {
        id: goalId,
      },
    });
    res.status(200).json(deletedGoal);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

module.exports = {
  getGoals,
  setGoals,
  updateGoal,
  deleteGoal,
};
