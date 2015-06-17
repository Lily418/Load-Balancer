Load-Balancer
=============
## Abstract
Cloud Service Providers like EC2 allows administrators to rent virtual machines running on their physical hardware, this provides an abstraction between physical hardware and computing resources. With this development rather than investing time and money into acquiring physical servers, systems administrators can access computing resources on demand.

In a traditional static system the amount of servers required to process user's requests would need to be predicted days in advance to allow time to order and congure physical hardware. In contrast, Cloud Computing introduces the concept of auto-scaling, we can monitor a system in real time and request new resources as we require them with the goal of maximizing CPU utilization whilst minimizing response time, we want to deliver a fast service to users without wasting money on unused servers. This raises new issues however, setting up new servers running on virtual machines in the cloud (instances) still takes a few minutes, if the system's usage increases rapidly there will be a delay in provisioning more instances which will lead to a system slow down, but provisioning more instances than required would
waste money.

This project presents a potential solution to this problem, by using Machine Learning to record and model the load on a
system we can predict how many instances will be required and proactively scale to meet this demand. To compare methods of scaling we implemented a simulation of the cloud environment and ran experiments using different auto-scaling algorithms.

Evaluating these experiments found we can successfully use a predictive auto-scaling algorithm to reduce response time at the cost of increasing resource use but whilst still using less than the resources required in a static system.
