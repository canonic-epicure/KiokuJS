use inc::Module::JSAN::DSL;

name            JiojuDB

version         0.01
author          'Nickolay (SamuraiJack) Platonov <root@symbie.org>'

abstract        'Persistent layer for Joose, mostly targeting NoSQL backends'
license         lgpl


requires        Joose               3.01
requires        JooseX.Attribute    0.02
requires        JooseX.CPS          0.01

requires        Data.UUID           0.01
requires        Data.Visitor        0.01

docs_markup     mmd