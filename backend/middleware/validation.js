const validateTask = (req, res, next) => {
  const { title, description, completed, priority } = req.body;
  if (
    !title ||
    !description ||
    completed === undefined ||
    priority === undefined
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }
  if (typeof description !== "string") {
    return res.status(400).json({ message: "Description must be a string" });
  }
  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }
  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      message: `Priority must be one of: ${validPriorities.join(", ")}`,
    });
  }
  next();
};

export default validateTask;
